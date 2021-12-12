# Electriko puslapis

Asmeninis puslapis, skirtas susipažinti su elektros instaliacijos kainomis  ir išsikviesti elektriką

# Build With
HTML, CSS, React.js??, Node.js, MongoDB.

## BackEnd 

Reikia tureti: npm ir node

1) Susikurti faila .env ir į jį įrašty 

API_PORT -> portas ant kurio veiks API

MONGO_URI -> MongoDB URL su user:password   

TOKEN_KEY -> radndom stringas sukurti jwt token

2) command line paleisti commanda "cd ./backend"
3) command line paleisti commanda "npm install"
4) command line paleisti commanda "npm start"
5) backend api turi šuos routs : POST: /additem , /updateitem , /register , /login , /welcome GET: /getallitems DELETE: /deleteitem

## FrontEnd

Parašyta html ir css pagalba