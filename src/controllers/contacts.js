import Contact from "../db/models/Contact.js";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createContact = async (req, res) => {
    try {
        const { body, file, user } = req;
        let avatarURL = null;

        if (file) {
            const result = await cloudinary.v2.uploader.upload(file.path, {
                folder: "contacts",
            });
            avatarURL = result.secure_url;
        }

        const newContact = await Contact.create({ ...body, userId: user._id, avatarURL });
        res.status(201).json(newContact);
    } catch (error) {
        createError(res, error);
    }
};

export const updateContact = async (req, res) => {
    try {
        const { params: { contactId }, body, file, user } = req;
        let avatarURL = body.avatarURL;

        if (file) {
            const result = await cloudinary.v2.uploader.upload(file.path, {
                folder: "contacts",
            });
            avatarURL = result.secure_url;
        }

        const updatedContact = await Contact.findOneAndUpdate(
            { _id: contactId, userId: user._id },
            { ...body, avatarURL },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(updatedContact);
    } catch (error) {
        createError(res, error);
    }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};