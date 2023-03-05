import mongoose from 'mongoose';
import type * as type from '../../types';
import * as enums from '../../enums';

export const detailsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message not provided'],
      minlength: [2, 'Min length is 2 characters'],
      maxlength: [1000, 'Max message length is 1000 characters'],
    },
  },
  { collection: enums.EDbCollections.MessageDetails },
);

const Details = mongoose.model<type.IMessageDetails>('Details', detailsSchema);
export default Details;
