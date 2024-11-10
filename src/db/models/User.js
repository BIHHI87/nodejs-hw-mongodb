import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateOptions } from './hooks.js';
import { emailRegexp } from '../../constants/users.js';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		match: emailRegexp,
		required: true,
	},
	password: {
		type: String,
		required: true,
	}

}, { versionKey: false, timestamps: true });

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateOptions);

userSchema.post('findOneAndUpdate', handleSaveError);

export const UserCollection = mongoose.model('User', userSchema);

export default UserCollection;

