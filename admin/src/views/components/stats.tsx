import { useContext, useMemo } from "react";
import { ContestContext } from "../../context/contestContext";

export default function Stats() {
  const { selected } = useContext(ContestContext);
  const stats = useMemo(
    () => [
      {
        name: "Total Serials",
        stat: selected?.total ?? 0,
      },
      {
        name: "Activated Serials",
        stat: selected?.selled ?? 0,
      },
      {
        name: "Sellers",
        stat: selected?.sellers ?? 0,
      },
    ],
    [selected]
  );

  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Statistics
      </h3>
      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-orange-600">
                {item.stat}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
