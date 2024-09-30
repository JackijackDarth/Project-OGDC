const { Router } = require('express');
const fs = require("fs");

const menuRoutes = Router();

console.log("chargement des images");

const burrito = fs.readFileSync("./images/burrito.jpg").toString('base64');
const croissant = fs.readFileSync("./images/croissant.jpg").toString('base64');
const pouding = fs.readFileSync("./images/pouding.jpg").toString('base64');
const overnight = fs.readFileSync("./images/overnight.jpg").toString('base64');
const grilledcheese = fs.readFileSync("./images/grilledcheese.jpg").toString('base64');
const wrapvege = fs.readFileSync("./images/wrapvege.jpg").toString('base64');
const wrappouletfeta = fs.readFileSync("./images/wrappouletfeta.jpg").toString('base64');
const paninichevre = fs.readFileSync("./images/paninichevre.jpg").toString('base64');
const saladeepinard = fs.readFileSync("./images/saladeepinard.jpg").toString('base64');
const salademarche = fs.readFileSync("./images/salademarche.jpg").toString('base64');
const smoothie1 = fs.readFileSync("./images/smoothie1.jpg").toString('base64');
const smoothie2 = fs.readFileSync("./images/smoothie2.jpg").toString('base64');
const smoothie3 = fs.readFileSync("./images/smoothie3.jpg").toString('base64');
const smoothie4 = fs.readFileSync("./images/smoothie4.jpg").toString('base64');
const smoothie5 = fs.readFileSync("./images/smoothie5.jpg").toString('base64');
const espresso = fs.readFileSync("./images/espresso.jpg").toString('base64');
const latte = fs.readFileSync("./images/latte.jpg").toString('base64');
const americano = fs.readFileSync("./images/americano.jpg").toString('base64');

menuRoutes.get('/', async (req, res) => {

  res.json([
    {
      titre: "Déjeuner",
      items: [
        {
          idItem: "1",
          nomItem: 'Burrito matin',
          image: burrito,
          prix: 10.00,
        },
        {
          idItem: "2",
          nomItem: 'Croissant',
          image: croissant,
          prix: 2.50,
        },
        {
          idItem: "3",
          nomItem: 'Pouding de chia',
          image: pouding,
          prix: 7.75,
        },
        {
          idItem: "4",
          nomItem: "Overnight à l'avoine",
          image: overnight,
          prix: 7.50,
        },
      ]
    },
    {
      titre: "Sandwichs",
      items: [
        {
          idItem: "5",
          nomItem: 'Grilled Cheese',
          image: grilledcheese,
          prix: 7.50,
        },
        {
          idItem: "6",
          nomItem: 'Wrap végé',
          image: wrapvege,
          prix: 12.00,
        },
        {
          idItem: "7",
          nomItem: 'Wrap au poulet-féta',
          image: wrappouletfeta,
          prix: 11.50,
        },
        {
          idItem: "8",
          nomItem: 'Panini Chèvre',
          image: paninichevre,
          prix: 6.00,
        },
      ]
    },
    {
      titre: "Salades",
      items: [
        {
          idItem: "9",
          nomItem: 'Salade épinard',
          image: saladeepinard,
          prix: 5.00,
        },
        {
          idItem: "10",
          nomItem: 'Salade du marché',
          image: salademarche,
          prix: 3.50,
        },
      ]
    },
    {
      titre: "Smoothies",
      items: [
        {
          idItem: "11",
          nomItem: 'Tropical',
          image: smoothie1,
          prix: 7.50,
        },
        {
          idItem: "12",
          nomItem: 'Fraise, banane',
          image: smoothie2,
          prix: 7.50,
        },
        {
          idItem: "13",
          nomItem: 'Réconfort',
          image: smoothie3,
          prix: 8.50,
        },
        {
          idItem: "14",
          nomItem: 'Vert-grano',
          image: smoothie4,
          prix: 9.60,
        },
        {
          idItem: "15",
          nomItem: 'Réveil matin',
          image: smoothie5,
          prix: 11.50,
        },
      ]
    },
    {
      titre: "Breuvages",
      items: [
        {
          idItem: "16",
          nomItem: 'Espresso',
          image: espresso,
          prix: 3.75,
        },
        {
          idItem: "17",
          nomItem: 'Latte',
          image: latte,
          prix: 4.00,
        },
        {
          idItem: "18",
          nomItem: 'Americano',
          image: americano,
          prix: 3.25,
        },
      ]
    },
  ]);
});

//module.exports = menuRoutes;

module.exports = {
  menuRoutes,
};
