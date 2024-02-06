//  ## В рамках БД BANK_110723 напишите след/запросы:

// вывести две случайных eur-транзакции

db.txs.aggregate([{ $match: { currency: /eur/i } }, { $sample: { size: 2 } }]);

// вывести юзеров, которые не отправляли средства (не делали транзакции)

db.clients.aggregate([
  {
    $lookup: {
      from: "txs",
      localField: "_id",
      foreignField: "sender_id",
      as: "sender_transactions",
    },
  },
  {
    $match: {
      sender_transactions: { $exists: false },
    },
  },
]);//клиент_без_переводов

// вывести сумму отправленных EUR-транзакций для каждого юзера

db.txs.aggregate([
  { $match: { currency: /eur/i } },
  {
    $group: {
      _id: "$sender_id",
      total_amount: { $sum: "$amount" },
    },
  },
  {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "_id",
      as: "sender",
    },
  },
  { $unwind: "$sender" },
  { $project: { _id: 0, total_amount: 1, "sender.fullname": 1 } },
]); //общая_сумма+имя_отправителя
