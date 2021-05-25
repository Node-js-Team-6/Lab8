export default (mongoose, mongoosePaginate) => {
  let schema = mongoose.Schema(
    {
      date: Date,
      username: String,
      text: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
    {
      optimisticConcurrency: true,
      timestamp: true,
    }
  );

  schema.plugin(mongoosePaginate);

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Comment = mongoose.model("comment", schema);
  return Comment;
};
