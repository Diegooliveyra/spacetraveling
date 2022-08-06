import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  slug: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {


  return (
    <>
      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>


        <article className={styles.content}>
          {posts.map(post => {
            return (
              <Link key={post.slug} href={`/post/${post.slug}`}>
                <a className={styles.post}>
                  <h2>{post.data?.title}</h2>
                  <p>{post.data?.subtitle}</p>
                  <div className={styles.publication_info}>
                    <div>
                      <FiCalendar />
                      <span>{post.first_publication_date}</span>
                    </div>
                    <div>
                      <FiUser />
                      <span>{post.data?.author}</span>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </article>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2,
  });

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), "dd MMM yyyy", { locale: ptBR }),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: post.data.author,
      },
    };
  });
  return {
    props: { posts },
    revalidate: 60 * 60, // 1 hour
  };
};
