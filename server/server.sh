#!/bin/bash	

_server_main() {
	java -jar simple-websocket-chat-1.0.0-SNAPSHOT-jar-with-dependencies.jar
}

_server_main ${*}
