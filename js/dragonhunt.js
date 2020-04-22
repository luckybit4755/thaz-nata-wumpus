const TESTING = true;

const Game = function() {
	const self = this;
	self.state = false;
	self.players = {};

	self.init = function() {
		XOZO( document );
		self.connect4fun();
	};
	
	self.connect4fun = function() {
		let username = document.inputFor( 'username' );
		let server   = document.inputFor( 'server' );
		let players  = document.inputFor( 'number of players' );
		let connect  = document.byContents( 'connect' );

		server.value = server.value.replace( /localhost/, document.location.host );

		connect.onclick = function() {
			self.user = username.value;
			self.players[ self.user ] = 1;
			self.playerCount = parseInt( players.value );
			self.socko = new socko( JZ.ruckus(
				  SOCKO_ENUMS.server,  server.value
				, SOCKO_ENUMS.user,    self.user
				, SOCKO_ENUMS.message, self.onMessage
				, SOCKO_ENUMS.ready,   self.sendHello
			))

			username.disabled = server.disabled = players.disabled = connect.disabled = 1;
			document.theTag( 'status' ).add( document.nu( {tag:'nfo',text:'connecting'} ) );
		};

		if ( TESTING ) {
			username.value = JZ.randomPlayerName();
			//connect.click(); // something is hinky if old users are still around... :-(
		}
	};

	self.onMessage = function( message ) {
		let handler = 'on_' + message.action;
		if ( handler in self ) {
			self[ handler ]( message );
		}
	};

	self.on_starting = function( message ) {
		let player = message.head.from;
		self.players[ player ] = 1;
		document.theTag( 'status' ).prepend( document.nu( {tag:'nfo',text:'player ' + player + ' joined'} ) );

		let players = Object.keys( self.players );
		if ( self.playerCount == players.length ) {
			document.theTag( 'status' ).prepend( document.nu( {tag:'nfo',text:'everyone is ready to play: '+ players} ) );
			FX.fade( document.theTag( 'join' ), self.startGame );
		}
	};

	/* ============================================================================= */

	self.sendHello = function() {
		self.state = 'starting';
		let message = {action:self.state};
		self.socko.sendTillAcknowledged( message, self.playerCount - 1 );
			
		document.theTag( 'status' ).prepend( document.nu( {tag:'nfo',text:'waiting on other players'} ) );
	};

	/* ============================================================================= */

	self.startGame = function() {
		console.log( 'sweet...' );
		document.theTag( 'play' ).style.display = 'block';

		self.messages = document.theTag( 'messages' );

		let chat_input = document.byId( 'chat_input' );
		document.byContents( 'say' ).onclick = function() {
			if ( !chat_input.value ) return;

			let message = {action:'sez',value:chat_input.value};
			self.socko.sendTillAcknowledged( message, self.playerCount - 1 );
			chat_input.value = '';

			self.on_sez( message );
		}

		if ( TESTING ) {
			chat_input.value = 'sup?';
			document.byContents( 'say' ).click();
		}
	};

	self.on_sez = function( message ) {
		if ( !self.messages ) return;
		let txt = message.head.from + ': ' + message.value;
		self.messages.prepend( 
			document.nu( 
				{
					  tag:'message'
					, kids:[
						  {tag:'from','text':message.head.from}
						, {tag:'said','text':message.value}
					]
				}
			)
		);
	};

	/* ============================================================================= */
	self.init();
};
