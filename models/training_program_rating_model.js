// models/Rating.js
const mongoose = require("mongoose");

const TrainingRatingSchema = new mongoose.Schema(
    {
        training: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
        trainee:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating:   { type: Number, min: 1, max: 5, required: true },
        review:   { type: String, maxlength: 2000 },
    },
    { timestamps: true }
);

// Prevent duplicate rating per trainee per training
TrainingRatingSchema.index({ training: 1, trainee: 1 }, { unique: true });

// Recalculate stats helper
TrainingRatingSchema.statics.calculateStats = async function (trainingId) {
    const stats = await this.aggregate([
        { $match: { training: new mongoose.Types.ObjectId(trainingId) } },
        { $group: { _id: "$training", averageRating: { $avg: "$rating" }, ratingsCount: { $sum: 1 } } },
    ]);

    const { averageRating = 0, ratingsCount = 0 } = stats[0] || {};
    await mongoose.model("TrainingProgram").findByIdAndUpdate(trainingId, {
        averageRating: Number(averageRating.toFixed(2)),
        ratingsCount,
    });
};

// Recompute after create/update/delete
TrainingRatingSchema.post("save", function () { this.constructor.calculateStats(this.training); });
TrainingRatingSchema.post("findOneAndUpdate", function (doc) { if (doc) doc.constructor.calculateStats(doc.training); });
TrainingRatingSchema.post("findOneAndDelete", function (doc) { if (doc) doc.constructor.calculateStats(doc.training); });

module.exports = mongoose.model("TrainingRatings", TrainingRatingSchema);
