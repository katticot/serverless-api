import { handleRequest } from './handler'

addEventListener('fetch', (event) => {

    ADDRESS_STORE.put("some","value");
    event.respondWith(handleRequest(event.request,ADDRESS_STORE))
})
