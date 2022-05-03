/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

const memoryOptions = [
  { name: "Married", inStock: true },
  { name: "single", inStock: true },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Radio({ select }: { select: (val: boolean) => void }) {
  const [mem, setMem] = useState(memoryOptions[2]);

  useEffect(() => {
    if (mem) select(mem.name == "Married");
  }, [mem]);
  return (
    <RadioGroup value={mem} onChange={setMem} className="mt-2">
      <RadioGroup.Label className="sr-only">
        Choose your mariage status
      </RadioGroup.Label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-2">
        {memoryOptions.map((option) => (
          <RadioGroup.Option
            key={option.name}
            value={option}
            className={({ active, checked }) =>
              classNames(
                option.inStock
                  ? "cursor-pointer focus:outline-none"
                  : "opacity-25 cursor-not-allowed",
                active ? "ring-2 ring-offset-2 ring-orange-500" : "",
                checked
                  ? "bg-orange-600 border-transparent text-white hover:bg-orange-700"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
              )
            }
            disabled={!option.inStock}
          >
            <RadioGroup.Label as="p">{option.name}</RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
