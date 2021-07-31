import React, { Component, useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import title from '../assets/images/International_Pokemon_title.png';
import PokeBox from './PokeBox';
import axios from 'axios';
import Global from '../Global';
import { Row, Col } from 'react-bootstrap';
import Pokemon from './Pokemon';
import Loader from './Loader';


const Home = () => {

    const d = document,
        $main = d.querySelector('main'),
        $links = d.querySelector('links');

    const loadPokemons = async (url) => {

        try {
            $main.innerHTML = <Loader/>;
            let res = await fetch(url),
                json = await res.json(),
                $template = "",
                $prevLink = null,
                $nextLink = null;

            if (!res.ok) throw { status: res.status, statusText: res.statusText }

            for (let i = 0; i < json.results.length; i++) {
                try {
                    let res = await fetch(json.results[i].url),
                        pokemon = await res.json();
                    if (!res.ok) throw { status: res.status, statusText: res.statusText }
                    $template += `
                        <figure>
                            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
                            <figcaption>${pokemon.name}</figcaption>
                        </figure>
                    `;
                } catch (err) {
                    let message = err.statusText || "Ocurrió un Error";
                    $template += `
                        <figure>
                            <figcaption>${err.status}: ${err.message}</figcaption>
                        </figure>
                        `;
                }

            }//End For

            $main.innerHTML = $template;
            $prevLink = json.previous ? `<a href="${json.previous}">⏮️</a>` : "";
            $nextLink = json.next ? `<a href="${json.next}">⏭️</a>` : "";
            $links.innerHTML = $prevLink + " " + $nextLink;

        } catch (err) {
            let message = err.statusText || "Ocurrió un Error";
            $main.innerHTML = `<p>Error ${err.status}: ${err.message}<p> `
        }
    }
    d.addEventListener("DOMContentLoaded", e => loadPokemons(Global.url + 'pokemon/?offset=0&limit=3'))

    d.addEventListener("click", e => {
        if (e.target.matches(".links a")) {
            e.preventDefault();
            loadPokemons(e.target.getAttribute("href"))
        }
    })


    return (
        <div id="home">

            <Slider
                title=''
                image={title}
                /*title="Gracias por visitarme! Este Sitio está Diseñado con React!"*/
                btn="PokeBox"
                size="slider-big"
            />

            <div className="center">

                <div id="content">
                    <h1 className="subheader">Pokemones por página</h1>

                {loadPokemons()}
                </div>

                <Sidebar />


            </div> {/* FIN DIV CENTER */}


        </div>
    );

}

export default Home;