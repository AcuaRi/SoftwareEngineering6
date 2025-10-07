export async function mockChatAPI(userInput) {
    console.log("Mock API 호출됨:", userInput);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (userInput.includes("요약 캐러셀")) {
        return {
            type: 'summaryCarousel',
            content: {
                text: "React는 UI 구축을 위한 강력한 라이브러리입니다. 다음은 React의 핵심 개념들을 요약한 내용입니다. 카드를 넘겨 확인해보세요.",
                cards: [
                    {
                        title: '1. 컴포넌트 (Component)',
                        text: 'UI를 독립적이고 재사용 가능한 조각으로 나눈 것입니다. 레고 블록처럼 조립하여 앱을 만듭니다.',
                        imageUrl: 'https://images.unsplash.com/photo-1561883088-039e53143d73?q=80&w=1387&auto=format&fit=crop',
                        link: 'https://react.dev/',
                    },
                    {
                        title: '2. JSX (JavaScript XML)',
                        text: 'JavaScript 코드 안에서 HTML과 유사한 마크업을 작성할 수 있게 해주는 문법 확장입니다.',
                        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop',
                        link: 'https://react.dev/',
                    },
                    {
                        title: '3. State와 Props',
                        text: 'State는 컴포넌트 내부에서 변하는 데이터, Props는 부모로부터 받는 데이터입니다. 데이터 흐름을 관리합니다.',
                        imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1470&auto=format&fit=crop',
                    }
                ]
            }
        };
    }

    if (userInput.includes("캐러셀")) {
        return {
            type: 'carousel',
            content: [
                {
                    title: 'React의 주요 개념',
                    text: '가상 DOM, JSX, 컴포넌트 등 React의 핵심 개념을 알아보세요.',
                    imageUrl: 'https://images.unsplash.com/photo-1561883088-039e53143d73?q=80&w=1387&auto=format&fit=crop',
                    link: 'https://react.dev/'
                },
                {
                    title: 'State와 Props',
                    text: '컴포넌트의 데이터를 관리하는 두 가지 중요한 요소, State와 Props의 차이점을 확인하세요.',
                    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1470&auto=format&fit=crop',
                },
                {
                    title: 'React Hooks',
                    text: '함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 강력한 도구입니다.',
                    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop',
                }
            ]
        };
    }

    if (userInput.includes("카드")) {
        return {
            type: 'card',
            content: {
                title: 'React에 대해 알아보기',
                text: 'React는 컴포넌트 기반의 UI 라이브러리로, 페이스북(현 메타)에서 만들었습니다. 선언적인 UI 작성이 가능하여 생산성을 높여줍니다.',
                imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop',
                link: 'https://react.dev/'
            }
        };
    }

    return {
        type: 'text',
        content: `'${userInput}'라고 하셨네요. 흥미로운 주제입니다.`
    };
}