# Commands and Paths
SHELL=/bin/bash

MAKE := make
GRUNT := $(shell pwd)/node_modules/.bin/grunt

.PHONY: install build release-build clean watch serve

all: build

install:
	###### Install ######
	###### Node.js ######
	@npm install
	###### Bower ######
	@bower install

build:
	###### Build ######
	@${GRUNT}

release-build:
	###### Build Release ######
	@BASE_PATH='/framework' ${GRUNT}

clean:
	###### Cleanup ######
	@rm -f ./build

watch:
	###### Watch ######
	@${GRUNT} watch

serve:
	###### Serve ######
	@${GRUNT} connect

