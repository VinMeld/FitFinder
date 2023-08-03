"use client";
import React, { useState, useEffect, useTransition } from "react";
import { useAuth } from "../../../components/providers/supabase-auth-provider";
import UserDropzone from "./components/UserDropzone";
import ShowImages from "./components/ShowImages";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage, useFormikContext  } from "formik";
import * as Yup from "yup";
import ChipsArray from "./components/ChipArray";
import { useRouter } from "next/navigation";
import InputMask from 'react-input-mask';
export default function TrainerEdit() {
  const { user, trainer } = useAuth();
  const [uploadCount, setUploadCount] = useState(0);
  const [display_name, setDisplayName] = useState<string>("");
  const [price_range_start, setPricingStart] = useState<number>(0);
  const [price_range_end, setPricingEnd] = useState<number>(0);
  const [bio, setBio] = useState<string>("");
  const [yoe, setYoe] = useState<number>(0);
  const [instagram, setInstagram] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [charCount, setCharCount] = useState(0);
  const [phone_number, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user && trainer) {
      setDisplayName(user.display_name || "");
      setBio(trainer.bio || "");
      setYoe(trainer.yoe || 0);
      setInstagram(trainer.instagram || "");
      setWebsite(trainer.website || "");
      setPricingStart(trainer.price_range_start || 0);
      setPricingEnd(trainer.price_range_end || 0);
      setPhoneNumber(user.phone_number ? user.phone_number.toString() : "");
      setLoading(false);
      setCharCount(trainer.bio.length)
    }
  }, [user, trainer]);
  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required("Display name is required"),
    price_range_start: Yup.number()
      .positive("Pricing start must be above 0")
      .notRequired().max(10000, "Value too large"),
    price_range_end: Yup.number()
      .nullable()
      .notRequired()
      .test(
        "is-greater",
        "End price must be greater than start price",
        function (value) {
          let startPrice = this.resolve(Yup.ref("price_range_start")) as number; // get the value of price_range_start
          if (value === null || startPrice === null) {
            return true; // skip validation when value or startPrice is null
          }
          return value > startPrice;
        }
      ).max(10000, "Value too large"),
    bio: Yup.string().notRequired(),
    instagram: Yup.string().nullable().notRequired(),
    website: Yup.string().url("Must be a valid URL").nullable().notRequired(),
    yoe: Yup.number().nullable().notRequired().max(70, "Experience must be less than 70 years"),
    phone_number: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .nullable()
      .notRequired(),
  });
  // const handleBioChange = (event: any) => {
  //   const { setFieldValue } = useFormikContext();
  //   setFieldValue('bio', event.target.value);  // Updates Formik field value
  //   setBio(event.target.value);  // Updates local state value
  //   setCharCount(event.target.value.length);  // Updates character count
  // };
  const handlePhoneNumberChange = (event) => {
    // Get the raw value without the mask characters from the input
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    console.log(rawValue);
    console.log("RAW VALUE")
    // Set the numeric phone number to the state
    setPhoneNumber(rawValue);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ToastContainer />
      <div className=" bg-black flex items-center justify-center">
        <div className="w-4/5 h-auto bg-black">
          {
            <Formik
              initialValues={{
                display_name: display_name || "",
                price_range_start: price_range_start || null,
                price_range_end: price_range_end || null,
                bio: bio || null,
                instagram: instagram || null,
                website: website || null,
                phone_number: phone_number || "",
                yoe: yoe || null,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                if(phone_number.length >= 11){
                  values.phone_number = phone_number;
                } else {
                  values.phone_number = "";
                }
                try {
                  const response = await fetch("/api/users", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  });

                  if (!response.ok) {
                    if (response.status === 400) {
                      return response.text().then((message) => {
                        toast.error(message); // Display the "Please be nicer" message
                      });
                    } else {
                      toast.error("Oops there was an error!");
                    }
                  } else {
                    toast.success("Profile updated successfully!");
                    console.log(
                      `Update was successful, status code: ${response.status}`
                    );

                    startTransition(() => {
                      // Refresh the current route and fetch new data
                      // from the server without losing
                      // client-side browser or React state.
                      router.refresh();
                    });
                  }
                } catch (error) {
                  toast.error("Oops there was an error!");
                  console.error(
                    "There was a problem with the fetch operation: ",
                    error
                  );
                }

                // After the fetch operation completes (either successfully or with an error), setSubmitting to false.
                setSubmitting(false);
              }}
            >
              {({ setFieldValue, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="">
                    <div className="mb-6">
                      <label
                        htmlFor="display_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Display Name
                      </label>
                      <Field
                        type="text"
                        name="display_name"
                        id="display_name"
                        class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="John"
                      />
                      <ErrorMessage
                        name="display_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="flex justify-start relative">
                      <UserDropzone
                        setUploadCount={setUploadCount}
                        uploadCount={uploadCount}
                        className="col-span-2 flex border-2 border-dotted hover:border-pink transition-all p-0.5 w-full h-64"
                      >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-6xl">
                          <span role="img" aria-label="camera">
                            📷
                          </span>
                          <p className="text-white">Add your photo</p>
                        </div>
                      </UserDropzone>
                    </div>
                    <ShowImages
                      setUploadCount={setUploadCount}
                      uploadCount={uploadCount}
                    />
                    <div className="relative z-0 w-full mb-6 group">
                      <ChipsArray user_id={user.id} />
                    </div>
                    
                    <div className="flex">
                      <div className="relative z-0 mb-6 group">
                        <p
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          style={{ minWidth: "140px" }}
                        >
                          Start Range $ per hour
                        </p>
                        <Field
                          type="number"
                          name="price_range_start"
                          id="price_range_start"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="10"
                        />

                        <ErrorMessage
                          name="price_range_start"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="mx-3 mt-3">
                      </div>
                      <div className="relative z-0 mb-6 group">
                        <p
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          style={{ minWidth: "140px" }}
                        >
                          End Range $ per hour
                        </p>
                        <Field
                          type="number"
                          name="price_range_end"
                          id="price_range_end"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="20"
                        />
                        <ErrorMessage
                          name="price_range_end"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <label
                        htmlFor="instagram"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Instagram @
                      </label>

                      <Field
                        type="text"
                        name="instagram"
                        id="instagram"
                        maxLength={30}
                        class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="john_doe"
                      />
                      <ErrorMessage
                        name="instagram"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label
                        htmlFor="website"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Website
                      </label>
                      <Field
                        type="text"
                        name="website"
                        id="website"
                        maxLength={50}
                        class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="https://www.johndoe.com"
                      />

                      <ErrorMessage
                        name="website"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="grid md:grid-cols-1 md:gap-6">
                      <div className="relative z-0 w-full mb-6 group">
                        <label
                          htmlFor="yoe"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Years of Experience:
                        </label>
                        <Field
                          type="number"
                          name="yoe"
                          id="yoe"
                          maxLength={2}
                          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="3"
                        />
                        <ErrorMessage
                          name="yoe"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>{" "}
                      <div className="relative z-0 w-full mb-6 group">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Phone
                        </label>
                        <InputMask
                          mask="+9 999-999-9999"
                          type="text"
                          name="phone_number"
                          id="phone_number"
                          maxLength={16} // Adjust the maximum length based on the mask
                          
                          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="+1 613-314-4443"
                          value={phone_number}
                          onChange={handlePhoneNumberChange}
                        />

                        {/* <Field
                          type="text"
                          name="phone_number"
                          id="phone_number"
                          maxLength={30}
                          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="613-314-4443"
                        /> */}
                        <ErrorMessage
                          name="phone_number"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="relative z-0 w-full mb-6 group">
                        <div style={{ position: "relative" }}>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Biography
                          </label>
                          <Field
                            name="bio"
                            id="bio"
                            as="textarea"
                            rows={5}
                            maxLength={1000}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(event: any) => {
                              setFieldValue("bio", event.target.value);
                              setCharCount(event.target.value.length);
                            }}
                          />
                            
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              color: "gray",
                            }}
                          >
                            {charCount}/1000 characters
                          </div>
                          <ErrorMessage
                            name="bio"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          }
        </div>
      </div>
    </>
  );
}
