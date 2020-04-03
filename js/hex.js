/* 
	pulled from https://www.redblobgames.com/grids/hexagons/#pixel-to-hex 
	my internet is down... unreal in 2020, but factual....

	TODO: 
		* use js from https://www.redblobgames.com/grids/hexagons/implementation.html
*/

const HXO = {
	xyz: function( x, y, z ) {
		return {x:x,y:y,z:z}
	}
	, cr: function( column, row ) {
		return {c:column,r:row}
	}
	, oddq_to_cube: function( column, row ) {
		let xyz = {};
		xyz.x = column;
		xyz.z = row - (column - (column&1)) / 2;
		xyz.y = 0 - xyz.x - xyz.z;
		return xyz;
	}
	, cr2xyz: function( cr ) {
		return this.oddq_to_cube( cr.c, cr.r );
	}
	, makeHexes: function() {
		/* this is specifically tailored for board.jpg... */
		let width = 3383;
		let height = 3709;

		let size = 80.5;

		let p = 1.508;
		let q = 1.75;

		let xstart = 34;
		let ystart = 34;

		let ystart2 = ystart - 10;

		let hexes = { 
			settings:{
				  size:size
				, xstart:xstart
				, ystart:ystart
				, ystart2:ystart2
			 }
			, cr:{}  
			//, xyz:{}
			, points:[]
		};

		for ( let angle = 0 ; angle < Math.PI * 2 ; angle += Math.PI / 3 ) {
			hexes.points.push( size * Math.cos( angle ) );
			hexes.points.push( size * Math.sin( angle ) );
		}

		let column = 0;
		for ( let x = xstart ; x < width ; x += size * p, column++ ) { 
			let row = 0;
			for ( let y = column % 2 ? ystart2 + size : ystart ; y < height ; y += size * q, row++ ) {
				let cr = HXO.cr( column, row );
				//let xyz = HXO.cr2xyz( cr );

				let hex = {cr:cr,/*xyz:xyz,*/x:x+size,y:y+size}

				hexes.cr[ JZ.flat( cr ) ] = hex;
				//hexes.xyz[ JZ.flat( xyz ) ] = hex;
			
				if ( 22 == row ) break; // south of here is sea :-P
			}	
		}


		return hexes;
	}
	, closest: function( hexes, x, y ) {
		let theCR = false;
		let theD = -1;
		let maxDistance = hexes.settings.size * hexes.settings.size;
		for ( let cr in hexes.cr ) {
			let hex = hexes.cr[ cr ];
			let dx = x - hex.x;
			let dy = y - hex.y;
			let d = Math.round( dx * dx + dy * dy );
			if ( d > maxDistance ) continue;
			if ( !theCR || d < theD ) {
				theD = d;
				theCR = cr;
			}
		}
		return theCR;
	}
};
