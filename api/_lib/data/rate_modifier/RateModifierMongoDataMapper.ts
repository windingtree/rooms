import { BaseMongoDataMapper } from '../../common/tools'
import {
    IBaseRateModifier,
    IBaseRateModifierDbData,
    IPatchRateModifierPayload,
    IPatchRateModifierPayloadDbData,
    IRateModifier,
    IRateModifierCollection,
    IRateModifierCollectionDbData, IRateModifierConditionPayload,
    IRateModifierDbData,
} from '../../common/types'
import { ObjectID } from "mongodb";
import { rateModifierConditionTypeFromString } from "../../interface/validators/RateModifier";

class RateModifierMongoDataMapper extends BaseMongoDataMapper {
    fromBaseEntity(record: IBaseRateModifier): IBaseRateModifierDbData {
        //convert array of roomsIds (as string) to array of ObjectID
        const rooms: Array<ObjectID> = []
        if (record.rooms) {
            record.rooms.forEach((roomId: string) => {
                const roomObjId: ObjectID | null = this.toObjectId(roomId);
                if (roomObjId) {
                    rooms.push(roomObjId)
                }
            })
        }
        return {
            hotelId: this.toObjectId(record.hotelId),
            type: record.type,
            description: record.description,
            enabled: record.enabled,
            priority: record.priority,
            criteriaType: record.criteriaType,
            priceModifierType: record.priceModifierType,
            priceModifierAmount: record.priceModifierAmount,
            combinable: record.combinable,
            condition: record.condition,
            rooms: rooms
        }
    }

    toBaseEntity(dbRecord: IBaseRateModifierDbData): IBaseRateModifier {
        const rooms: Array<string> = [];
        if (dbRecord.rooms) {
            dbRecord.rooms.forEach(roomIdObj => {
                rooms.push(this.fromObjectId(roomIdObj))
            })
        }
        return {
            hotelId: this.fromObjectId(dbRecord.hotelId),
            type: dbRecord.type,
            description: dbRecord.description,
            enabled: dbRecord.enabled,
            priority: dbRecord.priority,
            criteriaType: dbRecord.criteriaType,
            priceModifierType: dbRecord.priceModifierType,
            priceModifierAmount: dbRecord.priceModifierAmount,
            combinable: dbRecord.combinable,
            condition: dbRecord.condition,
            rooms: rooms
        };
    }

    fromPatchEntityPayload(payload: IPatchRateModifierPayload): IPatchRateModifierPayloadDbData {
        const availProps: Array<keyof IPatchRateModifierPayload> = [
            'hotelId',
            'type',
            'description',
            'enabled',
            'priority',
            'criteriaType',
            'priceModifierType',
            'priceModifierAmount',
            'combinable',
            'condition',
            'rooms'
        ]
/*
            if (!(prop in payload)) {
                return patchRoomTypePayloadDbData
            }
                patchRoomTypePayloadDbData
          /*  switch (prop) {
                case 'hotelId':
                    patchRoomTypePayloadDbData[prop] = this.toObjectId((payload[prop] as string))
                    break
                case 'enabled':
                case 'combinable':
                    patchRoomTypePayloadDbData[prop] = (payload[prop] as boolean)
                    break
                case 'description':
                case 'priceModifierType':
                case 'type':
                    patchRoomTypePayloadDbData[prop] = payload[prop] as string
                    break;
                case 'priceModifierAmount':
                    patchRoomTypePayloadDbData[prop] = payload[prop] as number
                    break;
                case 'condition':
                    const payloadCondition: IRateModifierConditionPayload = payload[prop] as IRateModifierConditionPayload
                    let dbCondition: IRateModifierConditionPayload = {};
                    if (payloadCondition) {
                        dbCondition = {
                            minStay: payloadCondition.minStay,
                            maxStay: payloadCondition.maxStay,
                            monday: payloadCondition.monday,
                            tuesday: payloadCondition.tuesday,
                            wednesday: payloadCondition.wednesday,
                            thursday: payloadCondition.thursday,
                            friday: payloadCondition.friday,
                            saturday: payloadCondition.saturday,
                            sunday: payloadCondition.sunday,
                            startDate: payloadCondition.startDate,
                            endDate: payloadCondition.endDate,
                            promoCode: payloadCondition.promoCode,
                        }
                    }
                    patchRoomTypePayloadDbData[prop] = dbCondition;
                    break;
                case 'rooms':
                    /!*patchRoomTypePayloadDbData[prop] = payload[prop] as Array<string>
                    console.log('patchRoomTypePayloadDbData[prop]=', patchRoomTypePayloadDbData[prop])*!/
                    patchRoomTypePayloadDbData[prop] = [this.toObjectId("dasd")];
                    break;
                case 'criteriaType':
                    patchRoomTypePayloadDbData[prop] = IRateModifierConditionType.LENGTH_OF_STAY;
                    break;
            }

        return patchRoomTypePayloadDbData*/
        return availProps.reduce((patchRoomTypePayloadDbData: IPatchRateModifierPayloadDbData, prop): IPatchRateModifierPayloadDbData => {
            if (!(prop in payload)) {
                return patchRoomTypePayloadDbData
            }
            switch(prop){
                case 'hotelId':
                    patchRoomTypePayloadDbData[prop] = this.toObjectId((payload[prop] as string))
                    break
                case 'enabled':
                case 'combinable':
                    patchRoomTypePayloadDbData[prop] = (payload[prop] as boolean)
                    break
                case 'description':
                case 'priceModifierType':
                case 'type':
                    patchRoomTypePayloadDbData[prop] = payload[prop] as string
                    break;
                case 'priceModifierAmount':
                    patchRoomTypePayloadDbData[prop] = payload[prop] as number
                    break;
                case 'condition':
                    const payloadCondition: IRateModifierConditionPayload = payload[prop] as IRateModifierConditionPayload
                    let dbCondition: IRateModifierConditionPayload = {};
                    if (payloadCondition) {
                        dbCondition = {
                            minStay: payloadCondition.minStay,
                            maxStay: payloadCondition.maxStay,
                            monday: payloadCondition.monday,
                            tuesday: payloadCondition.tuesday,
                            wednesday: payloadCondition.wednesday,
                            thursday: payloadCondition.thursday,
                            friday: payloadCondition.friday,
                            saturday: payloadCondition.saturday,
                            sunday: payloadCondition.sunday,
                            startDate: payloadCondition.startDate,
                            endDate: payloadCondition.endDate,
                            promoCode: payloadCondition.promoCode,
                        }
                    }
                    patchRoomTypePayloadDbData[prop] = dbCondition;
                    break;
                case 'rooms':
                    const rooms:Array<ObjectID> = [];
                    if(payload.rooms){
                        payload.rooms.forEach((roomId:string)=>{
                            const roomObjId:ObjectID|null=this.toObjectId(roomId)
                            if(roomObjId)
                                {rooms.push(roomObjId);}
                        })
                    }
                    patchRoomTypePayloadDbData[prop]=rooms;
                    break;
                case 'criteriaType':
                    patchRoomTypePayloadDbData[prop] = rateModifierConditionTypeFromString(payload[prop]);
                    break;
            }

            return patchRoomTypePayloadDbData;
        }, {})

    }


    fromEntity(profile: IRateModifier): IRateModifierDbData {
        return Object.assign({ _id: this.toObjectId(profile.id) }, this.fromBaseEntity(profile))
    }

    toEntity(profileDbData: IRateModifierDbData): IRateModifier {
        return Object.assign({ id: this.fromObjectId(profileDbData._id) }, this.toBaseEntity(profileDbData))
    }

    fromEntityCollection(profileCollection: IRateModifierCollection): IRateModifierCollectionDbData {
        return profileCollection.map((profile: IRateModifier): IRateModifierDbData => {
            return this.fromEntity(profile)
        })
    }

    toEntityCollection(profileCollectionDbData: IRateModifierCollectionDbData): IRateModifierCollection {
        return profileCollectionDbData.map((profileDbData: IRateModifierDbData): IRateModifier => {
            return this.toEntity(profileDbData)
        })
    }
}

export { RateModifierMongoDataMapper }
