import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'

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

  console.log(post)

  return (
    <>
      <Head>
        <title>SpaceTreveling | {title} </title>


      </Head>

      <header className={styles.header}>
        <img src={post.data.banner.url} alt="" />
      </header>


      <main className={styles.container}>

        <div className={styles.title}>
          <h1>{post.data.title}</h1>
        </div>

        <div className={styles.postInfo}>
          <div>
            <FiCalendar />
            {post.first_publication_date}
          </div>
          <div>
            <FiUser />
            {post.data.author}
          </div>
          <div>
            <FiClock />
            4 min
          </div>
        </div>

        <article className={styles.content}>
          {post.data.content.map(postContent => {
            return (
              <div key={postContent.heading}>
                <h2>{postContent.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(postContent.body),
                  }}
                />
              </div>
            );
          })}
        </article>
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
      author: response.data.author,
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      }
    },
  }


  return {
    props: { post }
  }
};
