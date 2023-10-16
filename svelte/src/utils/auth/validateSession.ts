import { auth } from "$lib"

auth.validateRequestOrigin({
	url: "http://localhost:3000/api",
	method: "POST",
	originHeader: "http://localhost:5173"
});