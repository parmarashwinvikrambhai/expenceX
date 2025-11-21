import Transaction from "../models/transaction-model";
import {ITransaction,IUpdateTransaction}  from "../types/transaction-types";

const createTransaction = async (data: ITransaction) => {
    const transaction = new Transaction(data)
    return await transaction.save();
}
const deleteTransaction = async (id: string, userId: string) => {
    return await Transaction.findOneAndDelete({
        _id: id,
        user: userId
    });
};
const updateTransaction = async (id: string, userId: string, data: IUpdateTransaction) => {
    return await Transaction.findOneAndUpdate({_id: id,user: userId}, data, { new: true });
}


export default {
    createTransaction,
    deleteTransaction,
    updateTransaction
}