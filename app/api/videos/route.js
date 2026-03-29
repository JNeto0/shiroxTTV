import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const QUEUE_KEY = 'shirox:queue';
const TTL_SECONDS = 3 * 24 * 60 * 60; // 3 dias

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    const queue = await redis.lrange(QUEUE_KEY, 0, -1);
    const parsedQueue = queue.map(item => {
      if (typeof item === 'string') {
        return JSON.parse(item);
      }
      return item;
    });
    return NextResponse.json(parsedQueue);
  } catch (error) {
    console.error('Erro ao buscar fila:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { url, name, plat } = await request.json();

    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { error: 'Link inválido!' },
        { status: 400 }
      );
    }

    if (plat !== 'ig' && plat !== 'tt') {
      return NextResponse.json(
        { error: 'Instagram ou TikTok apenas!' },
        { status: 400 }
      );
    }

    const video = {
      id: Date.now(),
      url,
      name: name || 'Anônimo',
      plat,
      createdAt: Date.now(),
      reacted: false,
    };

    // Adicionar ao início da fila
    await redis.lpush(QUEUE_KEY, JSON.stringify(video));
    // Set TTL para expirar em 3 dias
    await redis.expire(QUEUE_KEY, TTL_SECONDS);

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Erro ao enviar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar vídeo' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, reacted } = await request.json();

    const queue = await redis.lrange(QUEUE_KEY, 0, -1);
    const parsedQueue = queue.map(item => {
      if (typeof item === 'string') {
        return JSON.parse(item);
      }
      return item;
    });

    const index = parsedQueue.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }

    parsedQueue[index].reacted = reacted;

    // Limpar e reescrever fila
    await redis.del(QUEUE_KEY);
    for (const item of parsedQueue) {
      await redis.lpush(QUEUE_KEY, JSON.stringify(item));
    }
    await redis.expire(QUEUE_KEY, TTL_SECONDS);

    return NextResponse.json(parsedQueue[index]);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar vídeo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const queue = await redis.lrange(QUEUE_KEY, 0, -1);
    const parsedQueue = queue.map(item => {
      if (typeof item === 'string') {
        return JSON.parse(item);
      }
      return item;
    });

    const filteredQueue = parsedQueue.filter(item => item.id !== id);

    if (filteredQueue.length === queue.length) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }

    await redis.del(QUEUE_KEY);
    for (const item of filteredQueue) {
      await redis.rpush(QUEUE_KEY, JSON.stringify(item));
    }
    if (filteredQueue.length > 0) {
      await redis.expire(QUEUE_KEY, TTL_SECONDS);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar vídeo' },
      { status: 500 }
    );
  }
}
