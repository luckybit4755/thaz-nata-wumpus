const SOCKO_ENUMS = { 
	  'server':'server'
	, 'user':'user'
	, 'ready':'ready'
	, 'error':'error'
	, 'message':'message'
	, 'ack':'ack'
	, 'sent':'sent'
};

const socko = function( parameters ) {
	const self = this;

	//-----------------------------------------------------------------------------

	self.init = function( parameters ) {
		self.messageNumber = 33;
		self.toAck = {};
		
		self.server = parameters[ SOCKO_ENUMS.server ];
		self.user = parameters[ SOCKO_ENUMS.user ];
		self.callbacks = parameters;
		self.connect();
	};

	//-----------------------------------------------------------------------------

	self.callMe = function( what, args ) {
		if ( self.callbacks && ( what in self.callbacks ) ) {
			return self.callbacks[ what ]( args );
		}
	}
	//-----------------------------------------------------------------------------

	self.connect = function() {
		self.socket = new WebSocket( self.server );
		self.socket.onopen = function( event ) {
			self.socket.onerror   = self.onError;
			self.socket.onmessage = self.onMessage;
			self.callMe( SOCKO_ENUMS.ready )
		};
		self.socket.onerror = function( event ) {
			console.log( 'ug: ' + event );
		}
	};

	self.onError = function( event ) {
		console.log( 'ag: ' + event );
		self.callMe( SOCKO_ENUMS.error, event );
	};

	self.onMessage = function( event ) {
		let message = JSON.parse( event.data );
		if ( message.head.from == self.user ) return;

		switch ( message.head.type ) {
			case SOCKO_ENUMS.message:
				self.callMe( SOCKO_ENUMS.message, message );
				self.sendAck( message );
				break;
			case SOCKO_ENUMS.ack:
				self.handleAck( event, message );
				break;
		}
	};

	self.handleAck = function( event, message ) {
		console.log( 'got ack: ' + event.data );
		if ( message.to.from !== self.user ) {
			console.log( 'this is not mine...: ' + self.user + ' and it is for ' + message.to.from );
			return;
		}

		let to = message.to.id;
		if ( !( to in self.toAck ) ) {
			console.log( 'not waiting for this ack now' + to );
			return;
		}

		let from = message.head.from;
		let acking = self.toAck[ to ];

		acking.acked[ from ] = 1;
		let acked = Object.keys( acking.acked ).length;
		if ( acked === acking.acks ) {
			clearInterval( acking.interval );
			delete self.toAck[ to ];
			console.log( 'ok now ' + to );
			if ( acking.callback ) {
				acking.callback();
			}
		} else {
			console.log( 'not yet... ' + to + ' cuz ' + acked + ' vs ' + acking.acks );
		}
	};

	self.sendAck = function( message ) {
		if ( !( 'acks' in message.head ) ) {
			console.log( 'no need to ack: ' + JSON.stringify( message ) );
			return;
		}

		let ack = {};
		ack.head = self.__header();
		ack.head.type = SOCKO_ENUMS.ack;
		ack.to = message.head;

		let text = JSON.stringify( ack );
		console.log( 'send ack ' + text );
		self.sendText( text );
	};

	//-----------------------------------------------------------------------------

	self.sendTillAcknowledged = function( message, acks, callback, delay ) {
		delay = JZ.ifUndefined( delay, 333 );

		message.head = self.__header();
		message.head.acks = acks;

		let key = message.head.id;
		let text = JSON.stringify( message );
		let sendMessage = function() { self.sendText( text ) };
		let interval = setInterval( sendMessage, delay );

		self.toAck[ key ] = { acked:{} , acks:acks , interval: interval , callback: callback };

		sendMessage();
	};

	self.stopSending = function( interval ) {
		clearInterval( interval );
	};

	self.sendText = function( text ) {
		self.socket.send( text );
	};

	self.send = function( message ) {
		message.head = self.__header;
		self.sendText( JSON.stringify( message ) );
		self.callMe( SOCKO_ENUMS.sent, message );
	};

	self.__header = function() {
		return { from:self.user, id:self.messageNumber++, type:SOCKO_ENUMS.message };
	};

	//-----------------------------------------------------------------------------

	self.init( parameters );
};
