import { HomeContainer, Product } from "@/styles/pages/home";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { stripe } from "@/lib/stripe";
import { GetStaticProps } from "next";
import Stripe from "stripe";
import Head from "next/head";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          return (
            <Product
              key={product.id}
              href={`/product/${product.id}`}
              className="keen-slider__slide"
              prefetch={false}
            >
              <Image src={product.imageUrl} width={520} height={480} alt="" />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          );
        })}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  console.log(response.data);
  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;
    const valuePrice = price.unit_amount ?? 0;
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valuePrice / 100) as string;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: formattedPrice,
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  };
};
