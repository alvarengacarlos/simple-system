import express from "express";

export default function config(app) {
    app.use(express.json());
}