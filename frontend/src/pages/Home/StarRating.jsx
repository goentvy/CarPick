const StarRating = ({ rating }) => {
    // 별점 설정 로직
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
    <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
        <img key={`full-${i}`} src="/images/common/star-full.svg" alt="★" width={18} height={18} />
        ))}
        {hasHalf && <img src="/images/common/star-half.svg" alt="☆" width={18} height={18} />}
        {[...Array(emptyStars)].map((_, i) => (
        <img key={`empty-${i}`} src="/images/common/star-empty.svg" alt="☆" width={18} height={18} />
        ))}
    </div>
    );
};

export default StarRating;