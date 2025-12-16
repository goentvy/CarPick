import StarRating from "./StarRating";

const reviews = [
  {
    id: 1,
    model: "CARNIVAL KA4 (G) 3.5",
    comment: "가족끼리 여행가기에는 카니발만한게 없는 것 같습니다.",
    rating: 5,
  },
  {
    id: 2,
    model: "THE NEW TORRES (G) 1.5",
    comment: "토레스 눈여겨보고있던터 다행히 합리적인 가격에 타볼수 있었어요.",
    rating: 4.5,
  },
  {
    id: 3,
    model: "RAY (E) 에어 2WD AT",
    comment: "레이 EV가 타보고싶었는데 저렴한 가격에 타볼수있어서 만족합니다.",
    rating: 3,
  },
];

const CustomerReview = () => {
  return (
    <section className="mb-8">
      <div className="grid gap-4 text-sm">
        {reviews.map((r) => (
          <div key={r.id} className="bg-blue-50 rounded-lg shadow-sm p-3">
            <p className="font-semibold mb-1">{r.model}</p>
            <StarRating rating={r.rating} />
            <p className="text-gray-600 text-sm my-3">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReview;
