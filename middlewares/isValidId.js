import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        res.status(404).json({ message: 'Not found' });
        return;
    }
    next();
};

export default isValidId;