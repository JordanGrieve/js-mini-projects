const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3001;

const server = http.createServer((request, response) => {
	const filePath = path.join(
		__dirname,
		request.url === "/" ? "index.html" : request.url
	);

	const extName = String(path.extname(filePath)).toLowerCase();

	const mimeTypes = {
		".html": "text/html",
		".css": "text/css",
		".js": "text/javascript",
		".png": "text/png",
	};

	const contentType = mimeTypes[extName] || "application/octet-stream";

	fs.readFile(filePath, (error, content) => {
		if (error) {
			if (error.code === "ENOENT") {
				response.writeHead(404, { "Content-Type": "text/html" });
				response.end("404: File Not Found Bro");
			}
		} else {
			response.writeHead(200, { "Content-Type": contentType });
			response.end(content, "utf-8");
		}
	});
});

server.listen(port, () => {
	console.log(`server is listening to ${port}`);
});
