"use client";
import React, { useState, useEffect, useTransition } from "react";
import { useAuth } from "../../../components/providers/supabase-auth-provider";
import { useDropzone } from "react-dropzone";
import UserDropzone from "../../../components/profiles/UserDropzone";
import Image from "next/image";
import ShowImages from "../../../components/profiles/ShowImages";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function TrainerEdit() {
  const { user, trainer } = useAuth();
  const [uploadCount, setUploadCount] = useState(0);
  const [displayName, setDisplayName] = useState<string>("");
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
      setPhoneNumber(user.phone_number.toString() || "");
      setLoading(false);
    }
  }, [user, trainer]);
  const validationSchema = Yup.object()
    .shape({
      display_name: Yup.string().required("Display name is required"),
      price_range_start: Yup.number().required("Pricing start is required"),
      price_range_end: Yup.number().moreThan(
        Yup.ref("price_range_start"),
        "End price must be greater than start price"
      ),
      bio: Yup.string().required("Biography is required"),
      instagram: Yup.string(),
      website: Yup.string().url("Must be a valid URL"),
      yoe: Yup.number(),
      phone_number: Yup.string().matches(
        phoneRegExp,
        "Phone number is not valid"
      ),
    })
    .test("Log errors", function (value) {
      console.log(this.options.context);
      return true;
    });

  const handleBioChange = (event: any) => {
    setBio(event.target.value);
    setCharCount(event.target.value.length);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className=" bg-black flex items-center justify-center">
    <div className="w-4/5 h-auto bg-black">

      <ToastContainer />
      {displayName &&
        price_range_start &&
        price_range_end &&
        bio &&
        instagram &&
        website &&
        yoe &&
        phone_number && (
          <Formik
            initialValues={{
              display_name: displayName || "",
              price_range_start: price_range_start || 0,
              price_range_end: price_range_end || 0,
              bio: bio || "",
              instagram: instagram || "",
              website: website || "",
              phone_number: phone_number || "",
              yoe: yoe || 0,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              console.log("Submitting form", values);
              try {
                const response = await fetch("/api/users", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });

                if (!response.ok) {
                  toast.error("Oops there was an error!");
                  throw new Error(`HTTP error! status: ${response.status}`);
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
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
              <div className="">

                 <div className="mb-6">
                  <label htmlFor="display_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Display Name</label>
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
                  <div className="flex justify-start"> {/* Use justify-start to move content to the left */}
                    <UserDropzone
                      setUploadCount={setUploadCount}
                      uploadCount={uploadCount}
                      className="col-span-2 flex items-center justify-center border-2 hover:border-pink transition-all p-0.5 w-full h-64"
                    >
                      <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-6xl"> {/* Use flex-col to stack items vertically */}
                          <span role="img" aria-label="muscle">💪</span>
                          <p className="text-white">Upload trainer image</p>
                        </div>                    
                      </div>
                    </UserDropzone>
                    
                  </div>
                  <ShowImages
                      setUploadCount={setUploadCount}
                      uploadCount={uploadCount}
                    />

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
                    <span className="text-white">-</span>
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
                <label htmlFor="instagram" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram @</label>

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
                <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Website
                  </label>
                  <Field
                    type="text"
                    name="website"
                    id="website"
                    maxLength={30}
                    class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="www.johndoe.com"
                  />
                  
                  <ErrorMessage
                    name="website"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="grid md:grid-cols-1 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                  <label htmlFor="yoe" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Years of Experience:</label>
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

                    <Field
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      maxLength={30}
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="613-314-4443"
                    />
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
                      <textarea
                        rows={5}
                        maxLength={1000}
                        name="floating_biography"
                        id="floating_biography"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=" "
                        value={bio}
                        onChange={handleBioChange}
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
        )}
        </div>
        </div>
    </>
  );
}
