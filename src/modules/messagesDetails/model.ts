import mongoose from 'mongoose';
import * as enums from '../../enums';
import type * as type from '../../types';

export const detailsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'message not provided'],
    minlength: [2, 'Min length is 2 characters'],
    maxlength: [1000, 'Max message length is 1000 characters'],
  },
});

const Details = mongoose.model<type.IMessageDetails>('Details', detailsSchema, enums.EDbCollections.MessageDetails);
export default Details;
