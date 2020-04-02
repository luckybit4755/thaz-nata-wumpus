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
	, pixel_to_hex: function( point, size ) {
		let c = ( 2./3 * point.x                        ) / size
		var r = (-1./3 * point.x  +  Math.sqrt(3)/3 * point.y) / size
		return this.hex_round(this.cr(c, r));
	}
	, hex_round: function( cr ) {
    	//return cube_to_axial(cube_round(axial_to_cube(hex)))
    	//return this.cube_to_axial(
		return this.cube_round( this.cr2xyz( cr ) );
	}

	, cube_round: function(xyz) {
		var rx = Math.round(xyz.x)
		var ry = Math.round(xyz.y)
		var rz = Math.round(xyz.z)

		var x_diff = Math.abs(rx - xyz.x)
		var y_diff = Math.abs(ry - xyz.y)
		var z_diff = Math.abs(rz - xyz.z)

		if ( x_diff > y_diff && x_diff > z_diff ) {
			rx = -ry-rz
		} else {
			if ( y_diff > z_diff ) {
				ry = -rx-rz
			} else {
				rz = -rx-ry
			}
		}

		return this.xyz(rx, ry, rz);
	}
	

};

