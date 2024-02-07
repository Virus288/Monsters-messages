clean:
	rm -rf ./build/

test:
	clear \
	&& npm run test:unit \
	&& npm run test:db \
	&& npm run test:e2e

buildDocker:
	docker build -t monsters/monsters-messages .

buildTestDocker:
	docker build -t monsters/monsters-messages-test .
