const JZ = {
	  toString: function( o, r, s ) { return JSON.stringify( o, r, s ) }
	, json:     function( o, r, s ) { return this.toString( o, r, s ) }
	, parse: function( d ) { return JSON.parse( d ); }
	, flat: function(o) {
		let az = [];
		let oz = [o];
		while (oz.length) {
			let w = oz.pop();
			for ( let k in w ) {
				let v = w[ k ];
				if ( 'object' === typeof( v ) ) {
					oz.push( v );
				} else {
					az.push( v );
				}
			}
		}
		return az.join( ',' );
	}
	, fmt: function() {
		let a = arguments;
		let s = a[ 0 ];
		for ( let i = 1 ; i < a.length ; i++ ) s = s.replace( /%[a-z]*/, a[ i ] );
		return s;
	}
	, get: function( url, callback ) {
		let x = new XMLHttpRequest();
		x.onload = function(e) { callback( e, this.responseText ) };
		x.open( 'get', url, true );
		x.send();
	}
};

const XOZO = function( fcku ) {
	XOZO_ALL( fcku );

	switch( fcku.tagName ) {
		case 'DOCUMENT': return XOZO_DOCUMENT( fcku );
		case 'CANVAS': return XOZO_CANVAS( fcku );
	}

	return fcku;
};

const XOZO_ALL = function( fcku ) {
	fcku.add = function( n ) { return fcku.appendChild( n ) };

	if ( !fcku.tagName && document == fcku ) {
		fcku.tagName = 'DOCUMENT';
	}

	return fcku;
};

const XOZO_DOCUMENT = function( fcku ) {
	fcku.add = function( n ) { return fcku.body.appendChild( n ) };
	fcku.byTag = function( tag ) { return fcku.getElementsByTagName( tag ) };
	fcku.theTag = function( tag ) { return XOZO( fcku.byTag( tag )[ 0 ] ) };
	fcku.byId  = function( id ) { return document.getElementId( id ) };
	fcku.nu = function( attributes ) {
		let tag = attributes.tag;
		let isText = ( 'text' === tag );
		let n = XOZO(
			isText ? document.createTextNode( attributes.value ) : document.createElement( tag )
		);

		if ( !isText ) {	
			for ( let key in attributes ) {
				let value = attributes[ key ];
				switch( key ) {
					case 'tag': break;
					case 'text': n.add( document.createTextNode( value ) ); break;
					case 'kids': for( let kk in value ) { n.add( this.nu( value[ kk ] ) ); } break;
					default: n.setAttribute( key, value );
				} 
			}
		}
		return n;
	};
	return fcku;
};

const XOZO_CANVAS = function( fcku ) {
	fcku.d2 = function() {
		fcku.context = fcku.context || fcku.getContext( '2d' );
		return fcku;
	};
	fcku.c2 = function() {
		if ( !fcku.context ) fcku.d2();
		return fcku.context;
	};
	fcku.txt = function( style, txt, x, y ) {
		( fcku.context || fcku.d2().context ).fillStyle = style;
		( fcku.context || fcku.d2().context ).fillText( txt, x, y );
	};
	fcku.poly = function() {
		let c = fcku.c2();

		let a = arguments;
		c.strokeStyle = a[ 0 ];
		c.beginPath();

		let i1 = 1;
		if ( Array.isArray( a[ i1 ] ) ) {
			a = a[ i1 ];
			i1 = 0;
		}

		for ( let i = i1 ; i < a.length ; i+= 2 ) {
			switch( i ) {
				case i1: c.moveTo( a[ i ], a[ i + 1 ] ); break;
				default: c.lineTo( a[ i ], a[ i + 1 ] );
			}
		}
	    c.closePath();   
		c.stroke();
	};

	fcku.circle = function( style, x, y, radius ) {
		let c = fcku.c2();
		c.strokeStyle = style;
		radius = radius || 44;
		c.beginPath();
		c.arc( x, y, radius, 0, 2 * Math.PI );
		c.stroke();
	};

	fcku.rect = function( style, x, y, w, h ) {
		let c = fcku.c2();
		c.strokeStyle = style;
		c.beginPath();
		c.rect( x, y, w, h );
		c.stroke();
	};

	fcku.fill = function( style ) {
		if ( !fcku.context ) fcku.d2();
        fcku.context.fillStyle = style
        fcku.context.fill();
	};

	return fcku;
}
