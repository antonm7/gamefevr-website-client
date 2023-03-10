import { Review_Type } from "../../types/schema";

export default function checkReviews(currentReviews: Review_Type[],
    userId: string | undefined): boolean {
    const isUserReviewd = currentReviews.filter(r =>
        r.userId === userId)
    if (isUserReviewd.length) return true
    return false
}