import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

// Import required modules
import { FreeMode, Pagination } from 'swiper/modules'
import { getMaincategory } from '../Redux/ActionCreators/MaincategoryActionCreators'
import { getSubcategory } from '../Redux/ActionCreators/SubcategoryActionCreators'
import { getBrand } from '../Redux/ActionCreators/BrandActionCreators'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function CategorySlider({ title }) {
    let [data, setData] = useState([])

    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    let BrandStateData = useSelector(state => state.BrandStateData)

    let dispatch = useDispatch()

    let [showPerPage, setShowPerPage] = useState(
        title === "Brand" ? 6 : 3
    )

    useEffect(() => {
        function handleWindowResize() {
            if (window.innerWidth < 576)
                setShowPerPage(1)
            else if (window.innerWidth < 798)
                setShowPerPage(2)
            else
                setShowPerPage(title === "Brand" ? 6 : 3)
        }

        handleWindowResize()

        window.addEventListener("resize", handleWindowResize)

        return () => {
            window.removeEventListener("resize", handleWindowResize)
        }
    }, [title])

    useEffect(() => {
        dispatch(getMaincategory())
    }, [dispatch])

    useEffect(() => {
        dispatch(getSubcategory())
    }, [dispatch])

    useEffect(() => {
        dispatch(getBrand())
    }, [dispatch])

    useEffect(() => {
        if (title === "Maincategory") {
            setData(MaincategoryStateData.filter(x => x.active))
        }
        else if (title === "Subcategory") {
            setData(SubcategoryStateData.filter(x => x.active))
        }
        else if (title === "Brand") {
            setData(BrandStateData.filter(x => x.active))
        }
        else {
            setData([])
        }
    }, [
        title,
        MaincategoryStateData,
        SubcategoryStateData,
        BrandStateData
    ])

    return (
        <>
            <section id="clients" className="clients section">

                <div className="container section-title" data-aos="fade-up">
                    <h2>{title}</h2>
                </div>

                <div
                    className="container"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >

                    <Swiper
                        slidesPerView={showPerPage}
                        spaceBetween={30}
                        freeMode={true}
                        loop={data.length > showPerPage}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[FreeMode, Pagination]}
                        className="mySwiper"
                    >

                        {
                            data.map((item) => {

                                let queryType =
                                    title === "Maincategory"
                                        ? "mc"
                                        : title === "Subcategory"
                                            ? "sc"
                                            : "br"

                                return (
                                    <SwiperSlide
                                        key={item.id}
                                        className="swiper-slide"
                                    >

                                        <Link
                                            to={`/shop?${queryType}=${item.name}`}
                                        >

                                            <img
                                                src={`/${item.pic}`}
                                                style={{
                                                    height:
                                                        title === "Brand"
                                                            ? 100
                                                            : 300
                                                }}
                                                className="w-100"
                                                alt={item.name}
                                            />

                                        </Link>

                                    </SwiperSlide>
                                )
                            })
                        }

                        <div className="swiper-pagination"></div>

                    </Swiper>

                </div>

            </section>
        </>
    )
}
