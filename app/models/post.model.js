export default (mongoose, mongoosePaginate) => {
  let schema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
      text: String,
      photos: [String],
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment",
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },
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

  const Post = mongoose.model("post", schema);
  return Post;
};
