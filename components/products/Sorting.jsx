import { setSortingOption } from "@/reducer/filterActions";

const filterOptions = [
  "Sort by (Default)",
  "Title Ascending",
  "Title Descending",
  "Price Ascending",
  "Price Descending",
];

export default function Sorting({ state, dispatch }) {
  return (
    <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
      <div className="btn-select">
        <span className="text-sort-value">{state.sortingOption}</span>
        <span className="icon icon-caret-down"></span>
      </div>
      <div className="dropdown-menu">
        {filterOptions.map((option, i) => (
          <div
            onClick={() => setSortingOption(dispatch, option)}
            key={i}
            className={`select-item ${
              state.sortingOption === option ? "active" : ""
            }`}
          >
            <span className="text-value-item">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
