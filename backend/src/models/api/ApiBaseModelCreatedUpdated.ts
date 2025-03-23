import {UUID} from './uuid';
import ApiBaseModelId from './ApiBaseModelId';

export default interface ApiBaseModelCreatedUpdated extends ApiBaseModelId {
  createdAt: Date;
  createdBy: UUID;
  updatedAt: Date;
  updatedBy: UUID;
}