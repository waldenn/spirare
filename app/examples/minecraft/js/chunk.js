Chunk = function(position,map){
    this.blocks = [];
    this.position = position;
    this.map = map;

    this.events = new Events();
    this.group = new THREE.Group();
    this.group.position.copy(this.worldPosition.multiplyScalar(game.blockSize));
    this.map.group.add(this.group);
}
Chunk.prototype = {
    blocks: [],
    position: new THREE.Vector3(),

    loading: false,
    saving: false,
    saved: true,
    
    mesh: undefined,
    group: undefined,
    map: undefined,
    events: undefined,
    /*
    export
    inport
    build
    blockChange
    */
    setBlock: function(position,data,dontBuild){
        //data is the export of a block or an id from the genorator
        if(_.isString(data)) data = {id: data};

        var oldBlock = '';
        var pos = positionToIndex(position,game.chunkSize);

        //dispose of the old block
        if(this.blocks[pos]){
            oldBlock = this.blocks[pos].__proto__.constructor.name;
            this.blocks[pos].dispose();
        }

        var block = blocks.createBlock(data.id,position,data,this);
        this.blocks[pos] = block;

        if(!dontBuild && block instanceof SolidBlock){
            this.build()
        }

        this.events.emit('blockChange',{
            block: block,
            from: oldBlock
        })

        return block;
    },
    getBlock: function(position){
        return this.blocks[positionToIndex(position,game.chunkSize)];
    },
    inportData: function(data){ //data is a array of blocks
        // this.blocks = data;
        data = data || [];

        for (var i = 0; i < data.length; i++) {
            this.setBlock(indexToPosition(i,game.chunkSize),data[i],true);
        };
        this.events.emit('inport',data);
        this.build();
    },
    exportData: function(){
        //going to have to loop through block array and export each one
        var data = [];
        for (var i = 0; i < this.blocks.length; i++) {
            data.push(this.blocks[i].exportData());
        };
        this.events.emit('export',data);
        return data;
    },
    build: function(){
        if(this.mesh){
            this.mesh.geometry.dispose();
            this.group.remove(this.mesh);
        }

        var meshed = CulledMesh(this.blocks);
        var geometry = new THREE.Geometry();

        geometry.faces.length = 0
        
        geometry.vertices = meshed.vertices;
        
        for (var i in meshed.faces) {
            var q = meshed.faces[i]

            //repeate two times since we use two face3(s) to replace face4
            var f = new THREE.Face3(q[0], q[1], q[2], new THREE.Vector3(), new THREE.Color(), q[4])
            geometry.faceVertexUvs[0].push(faceVertexUv(meshed,i))
            geometry.faces.push(f)

            var f = new THREE.Face3(q[0], q[2], q[3], new THREE.Vector3(), new THREE.Color(), q[4])
            geometry.faceVertexUvs[0].push(faceVertexUv2(meshed,i))
            geometry.faces.push(f)
        }
        
        geometry.computeFaceNormals()
        
        geometry.verticesNeedUpdate = true;
        geometry.elementsNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()

        this.mesh = new THREE.Mesh(geometry, blocks.blockMaterial)

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.scale.set(game.blockSize,game.blockSize,game.blockSize);

        this.group.add(this.mesh);

        this.events.emit('build');
    },
    dispose: function(){
        this.mesh.geometry.dispose();
        this.map.group.remove(this.group);
    },
    getNeighbor: function(v){
        if(_.isArray(v)) v = new THREE.Vector3().fromArray(v);
        v.sign();
        v.add(this.position);

        var id = v.toString();
        if(this.map.chunks[id]){
            return this.map.chunks[id];
        }
    },

    save: function(cb){
        this.map.saveChunk(this.position,cb);
    },
    remove: function(cb){
        this.map.removeChunk(this.position,cb);
    },
    unload: function(cb){
        this.map.unloadChunk(this.position,cb);
    }
}
Chunk.prototype.constructor = Chunk;
Object.defineProperties(Chunk.prototype,{
    worldPosition: {
        get: function(){
            return this.position.clone().multiplyScalar(game.chunkSize);
        }
    },
})

function faceVertexUv(meshed,i) {
    var vs = [
        meshed.vertices[meshed.faces[i][0]],
        meshed.vertices[meshed.faces[i][1]],
        meshed.vertices[meshed.faces[i][2]],
        meshed.vertices[meshed.faces[i][3]]
    ]
    var spans = {
        x0: vs[0].x - vs[1].x,
        x1: vs[1].x - vs[2].x,
        y0: vs[0].y - vs[1].y,
        y1: vs[1].y - vs[2].y,
        z0: vs[0].z - vs[1].z,
        z1: vs[1].z - vs[2].z
    }
    var size = {
        x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
        y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
        z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
    }
    if (size.x === 0) {
        if (spans.y0 > spans.y1) {
            var width = size.y
            var height = size.z
        }
        else {
            var width = size.z
            var height = size.y
        }
    }
    if (size.y === 0) {
        if (spans.x0 > spans.x1) {
            var width = size.x
            var height = size.z
        }
        else {
            var width = size.z
            var height = size.x
        }
    }
    if (size.z === 0) {
        if (spans.x0 > spans.x1) {
            var width = size.x
            var height = size.y
        }
        else {
            var width = size.y
            var height = size.x
        }
    }
    if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
        return [
            new THREE.Vector2(height, 0),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, width),
            // new THREE.Vector2(height, width)
        ]
    } 
    else {
        return [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, height),
            new THREE.Vector2(width, height),
            // new THREE.Vector2(width, 0)
        ]
    }
};

function faceVertexUv2(meshed,i) {
    var vs = [
        meshed.vertices[meshed.faces[i][0]],
        meshed.vertices[meshed.faces[i][1]],
        meshed.vertices[meshed.faces[i][2]],
        meshed.vertices[meshed.faces[i][3]]
    ]
    var spans = {
        x0: vs[0].x - vs[1].x,
        x1: vs[1].x - vs[2].x,
        y0: vs[0].y - vs[1].y,
        y1: vs[1].y - vs[2].y,
        z0: vs[0].z - vs[1].z,
        z1: vs[1].z - vs[2].z
    }
    var size = {
        x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
        y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
        z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
    }
    if (size.x === 0) {
        if (spans.y0 > spans.y1) {
            var width = size.y
            var height = size.z
        }
        else {
            var width = size.z
            var height = size.y
        }
    }
    if (size.y === 0) {
        if (spans.x0 > spans.x1) {
            var width = size.x
            var height = size.z
        }
        else {
            var width = size.z
            var height = size.x
        }
    }
    if (size.z === 0) {
        if (spans.x0 > spans.x1) {
            var width = size.x
            var height = size.y
        }
        else {
            var width = size.y
            var height = size.x
        }
    }
    if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
        return [
            new THREE.Vector2(height, 0),
            // new THREE.Vector2(0, 0),
            new THREE.Vector2(0, width),
            new THREE.Vector2(height, width)
        ]
    } 
    else {
        return [
            new THREE.Vector2(0, 0),
            // new THREE.Vector2(0, height),
            new THREE.Vector2(width, height),
            new THREE.Vector2(width, 0)
        ]
    }
};

//code from https://github.com/maxogden/voxel/blob/master/meshers/culled.js
function CulledMesh(blocks) {
    //Precalculate direction vectors for convenience
    var facePositions = new Array(3);
    for(var i=0; i<3; ++i) {
        facePositions[i] = [new THREE.Vector3(), new THREE.Vector3()];
        facePositions[i][0][ ['x','y','z'][(i+1)%3] ] = 1;
        facePositions[i][1][ ['x','y','z'][(i+2)%3] ] = 1;
    }

    //March over the blocks
    var vertices = [];
    var verticeCache = {};
    var faces = [];
    for(var index = 0; index < game.chunkSize*game.chunkSize*game.chunkSize; index++){
        var block = blocks[index];

        //if its not a block skip it
        if(!(block instanceof Block)) continue;

        var otherBlocks = [
            [block.getNeighbor([1,0,0]),0],
            [block.getNeighbor([0,1,0]),1],
            [block.getNeighbor([0,0,1]),2],
        ];
        //if we are at the edge then check all 6 blocks
        if(block.position.x == 0) otherBlocks.push([block.getNeighbor([-1,0,0]),0]);
        if(block.position.y == 0) otherBlocks.push([block.getNeighbor([0,-1,0]),1]);
        if(block.position.z == 0) otherBlocks.push([block.getNeighbor([0,0,-1]),2]);

        //Generate faces
        for(var d=0; d<otherBlocks.length; ++d){
            var otherBlock = otherBlocks[d][0];
            var faceSide = otherBlocks[d][1];

            if(!(block instanceof Block && otherBlock instanceof Block)) continue;

            if((block instanceof SolidBlock) !== (otherBlock instanceof SolidBlock)) {
                var side = (block instanceof SolidBlock)? 0 : 1;
                var mat = (block instanceof SolidBlock)? 0 : 1;
                if(d >= 3) side = (side)? 0 : 1; //flip the face around if we are checking more then 3 blocks
                var pos = block.position.clone();
                var u = facePositions[faceSide][side];
                var v = facePositions[faceSide][side^1];
                if(d < 3) ++pos[['x','y','z'][faceSide]];

                var v1ID = (pos.x        )+'|'+(pos.y        )+'|'+(pos.z        );
                var v2ID = (pos.x+u.x    )+'|'+(pos.y+u.y    )+'|'+(pos.z+u.z    );
                var v3ID = (pos.x+u.x+v.x)+'|'+(pos.y+u.y+v.y)+'|'+(pos.z+u.z+v.z);
                var v4ID = (pos.x    +v.x)+'|'+(pos.y    +v.y)+'|'+(pos.z    +v.z);
                var v1 = (verticeCache[v1ID] !== undefined)? verticeCache[v1ID] : verticeCache[v1ID] = vertices.push( new THREE.Vector3( pos.x        , pos.y        , pos.z         ) ) -1;
                var v2 = (verticeCache[v2ID] !== undefined)? verticeCache[v2ID] : verticeCache[v2ID] = vertices.push( new THREE.Vector3( pos.x+u.x    , pos.y+u.y    , pos.z+u.z     ) ) -1;
                var v3 = (verticeCache[v3ID] !== undefined)? verticeCache[v3ID] : verticeCache[v3ID] = vertices.push( new THREE.Vector3( pos.x+u.x+v.x, pos.y+u.y+v.y, pos.z+u.z+v.z ) ) -1;
                var v4 = (verticeCache[v4ID] !== undefined)? verticeCache[v4ID] : verticeCache[v4ID] = vertices.push( new THREE.Vector3( pos.x    +v.x, pos.y    +v.y, pos.z    +v.z ) ) -1;
                faces.push([v1, v2, v3, v4, mat ? otherBlock.material[faceSide][side] : block.material[faceSide][side]]);
            }
        }
    }
    return { vertices:vertices, faces:faces };
}