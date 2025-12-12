const StarRating = ({ rating }) => {
    // 별점 설정 로직
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
    <div className="flex gap-[2px]">
        {[...Array(fullStars)].map((_, i) => (
        <img key={`full-${i}`} src="/src/assets/star-full.svg" alt="★" width={18} height={18} />
        ))}
        {hasHalf && <img src="/src/assets/star-half.svg" alt="☆" width={18} height={18} />}
        {[...Array(emptyStars)].map((_, i) => (
        <img key={`empty-${i}`} src="/src/assets/star-empty.svg" alt="☆" width={18} height={18} />
        ))}
    </div>
    );
};

export default StarRating;