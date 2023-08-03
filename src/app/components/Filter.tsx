import React, { useState, useEffect, useRef  } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { categories } from "../../../public/index"
export default function Filter({tags, setTags, searchTerm, setSearchTerm }) {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleTagClick = (tag, e) => {
    e.preventDefault();
    console.log(tag);
    const newTags = [...tags];
    if (newTags.includes(tag)) {
      const tagIndex = newTags.indexOf(tag);
      newTags.splice(tagIndex, 1);
    } else {
      newTags.push(tag);
    }
    console.log(newTags)
    setTags(newTags);
  
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }
    if (newTags.length > 0) {
      params.append("tags", newTags.join(',')); // Join the tags with a comma
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.push(newUrl, { scroll: false });
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }
    // if (tags.length > 0) {
    //   params.append("tags", tags.join(',')); // Join the tags with a comma
    // }
    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.push(newUrl, { scroll: false });
  };
    
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  return (
    <form className="w-full flex" onSubmit={handleSubmit}>
      <div className="relative" ref={dropdownRef}>
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 whitespace-nowrap"
          type="button"
          onClick={toggleDropdown}
        >
          <Image
            src="/down_arrow_icon.svg"
            alt="Down Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          Tags
        </button>

        <div
          id="dropdown"
          className={`absolute left-0 mt-1 z-10 ${
            dropdownVisible ? "block" : "hidden"
          } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`} // Add conditional rendering here
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="#"
                  onClick={(e) => handleTagClick(category, e)}
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {category}
                  {tags.includes(category) && (
                    <span className="ml-2">✔</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Search Trainer Names..."
          value={searchTerm}
          onChange={handleSearchChange}
          required
        />
        <button
          type="submit"
          className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <Image src="/search_icon.svg" alt="Search" width={20} height={20} />
          <span className="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}
