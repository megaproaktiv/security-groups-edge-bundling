
init:
	npm i
generate:
	node index.js > data.json
server:
	python -m http.server 1337
demo:
	cp data.json.demo data.json 