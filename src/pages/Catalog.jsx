import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCatalogPageDetails } from "../services/operations/categoryAPI";
import Error404 from "./Error";
import Footer from "../components/common/Footer";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";

function Catalog() {

    const { loading } = useSelector((state) => state.profile)
    const [categoryId, setCategoryId] = useState()
    const [active, setActive] = useState(1)
    const { categoryName } = useParams()
    const [catalogPageData, setCatalogPageData] = useState([])

    //fetch all categories
    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.Categorys?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === categoryName)[0]._id
            setCategoryId(category_id)
        }
        getCategories();
    }, [categoryName])

    useEffect(() => {
        const getCategoryPageDetails = async () => {
            const res = await getCatalogPageDetails(categoryId);
            // console.log("CATEgory page Details ==>> ", res)
            setCatalogPageData(res)
        }
        if (categoryId) {
            getCategoryPageDetails()
        }
    }, [categoryId])

    console.log("CatalogPage Data ==>>", catalogPageData)

    if (loading || !catalogPageData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    // if (!loading && !catalogPageData.success) {
    //     return <Error404 />
    // }

    return (
        <>
            {/* Hero Section */}
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-yellow-25">
                            {catalogPageData?.data?.name}
                        </span>
                    </p>
                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.data?.name}
                    </p>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Populer
                    </p>
                    <p
                        className={`px-4 py-2 ${active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider
                        Courses={catalogPageData?.data?.course}
                    />
                </div>
            </div>

            {/* Section 2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Top courses in {catalogPageData?.diffCategory?.name}
                </div>
                <div className="py-8">
                    <CourseSlider
                        Courses={catalogPageData?.diffCategory?.course}
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {catalogPageData?.mostSellingCourse
                            ?.slice(0, 4)
                            .map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[400px]"} />
                            ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Catalog;
