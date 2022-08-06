import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const title = router.query.slug;



  return (
    <>
      <Head>
        <title>SpaceTreveling | {title} </title>


      </Head>
      <main className={styles.container}>


        <div>
          {post.data.content.map(({ heading, body }) => (
            <div>
              <h1>{heading}</h1>
              {body.map(({ text }) => {
                return <p>{text}</p>;
              })}
            </div>
          ))}

        </div>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const post = await prismic.getByType('posts', {
    pageSize: 2,
  });

  const paths = post.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  })

  return {
    paths: paths,
    fallback: true,
  }
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
    data: {
      content: (response.data.content),
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      }
    },
    author: response.data.author,
  }


  return {
    props: { post }
  }
};
