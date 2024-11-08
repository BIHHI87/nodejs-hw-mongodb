import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

const enableCloudinary = env("ENABLE_CLOUDINARY");

export const getAllContactsController = async (req, res, next) => {
	const { perPage, page } = parsePaginationParams(req.query);
	const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
	const { _id: userId } = req.user;
	const filter = parseContactsFilterParams(req.query);

	try {
		const data = await contactServices.getContacts({
			perPage,
			page,
			sortBy,
			sortOrder,
			filter: { ...filter, userId },
		});

		res.json({
			status: 200,
			message: 'Successfully found contacts!',
			data,
		});
	} catch (error) {
		next(error);
	}
};

export const getContactByIdController = async (req, res, next) => {
	const { id } = req.params;
	const { _id: userId } = req.user;
	const data = await contactServices.getContact({ _id: id, userId });
	if (!data) {
		throw createHttpError(404, `Contact with id=${id} not found`);
	}

	res.json({
		status: 200,
		message: `Successfully found contact with id ${id}!`,
		data,
	});
};

export const addContactController = async (req, res) => {
	let photo;
	if (req.file) {
		photo = enableCloudinary === "true"
			? await saveFileToCloudinary(req.file, "photo")
			: await saveFileToUploadDir(req.file);
	}

	const { _id: userId } = req.user;
	const contactData = { ...req.body, userId, photo };

	delete contactData._id;
	delete contactData.userId;

	const data = await contactServices.createContact(contactData);

	res.status(201).json({
		status: 201,
		message: 'Contact added successfully',
		data,
	});
};

export const upsertContactController = async (req, res) => {
	const { id } = req.params;
	const { _id: userId } = req.user;
	const contactData = { ...req.body };

	delete contactData._id;
	delete contactData.userId;

	const { isNew, data } = await contactServices.updateContact({ _id: id, userId }, contactData, { upsert: true });

	const status = isNew ? 201 : 200;

	res.status(status).json({
		status,
		message: 'Contact upserted successfully',
		data,
	});
};

export const patchContactController = async (req, res) => {
	const { id } = req.params;
	const { _id: userId } = req.user;
	const contactData = { ...req.body };

	delete contactData._id;
	delete contactData.userId;

	const result = await contactServices.updateContact({ _id: id, userId }, contactData);

	if (!result) {
		throw createHttpError(404, `Contact with id=${id} not found`);
	}

	res.status(200).json({
		status: 200,
		message: "Contact patched successfully",
		data: result.data,
	});
};

export const deleteContactController = async (req, res) => {
	const { id } = req.params;
	const { _id: userId } = req.user;
	const contact = await contactServices.deleteContact({ _id: id, userId });

	if (!contact) {
		return res.status(404).json({ message: "Contact not found" });
	}

	res.status(204).send();
};
