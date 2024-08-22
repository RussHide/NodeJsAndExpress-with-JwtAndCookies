import { pool } from "../db.js"

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
};

export const addUser = async (req, res) => {

};

export const editUser = async (req, res) => {

};

export const deleteUser = async (req, res) => {

};