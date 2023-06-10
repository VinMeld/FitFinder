'use client'
import Image from 'next/image'
import { useState, useEffect} from 'react'

export default function Page() {
  // Fetch countries:
  const [countries, setCountries] = useState<Country[] | null>(null)
  useEffect(() => {
    fetch('/api/countries')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data)
      })
  }, [])
  console.log("in page", countries)
  // Display countries:
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">FitFinder</h1>
      {countries ?
        countries.map((country: Country) => {
          return <h1 key={country.id}>{country.name}</h1> // using .id for key and .name for display
        })
        : 
        <h1>Trouble loading</h1>
      }
    </main>
  )
}