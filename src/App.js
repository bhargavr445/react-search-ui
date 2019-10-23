import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox, PagingInfo,
  ResultsPerPage,
  Paging,
  Facet,
  Sorting } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";


const connector = new AppSearchAPIConnector({
  searchKey: "search-v1oe5wy1hggnobkbf2uveuo7",
  engineName: "video-games",
  hostIdentifier: "host-ww92h9"
});

const configurationOptions = {
  apiConnector: connector,
  autocompleteQuery: {
    suggestions: {
      types: {
        documents: {
          // Which fields to search for suggestions.
          fields: ["name"]
        },
        // How many suggestions appear.
        size: 5
      }
    }
  },
  searchQuery: {
    search_fields: {
      // 1. Search by name of video game.
      name: {},
      
    },
    // 2. Results: name of the video game, its genre, publisher, scores, and platform.
    result_fields: {
      name: {
        // A snippet means that matching search terms will be highlighted via <em> tags.
        snippet: {
          size: 75, // Limit the snippet to 75 characters.
          fallback: true // Fallback to a "raw" result.
        }
      },
      genre: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      publisher: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      critic_score: {
        // Scores are numeric, so we won't attempt to snippet these, we'll just use the raw
        // value.
        raw: {}
      },
      user_score: {
        raw: {}
      },
      platform: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      image_url: {
        raw: {}
      }
    },
    // 3. Facet by scores, genre, publisher, and platform, which we'll use to build filters later.
    facets: {
      user_score: {
        type: "range",
        ranges: [
          { from: 0, to: 5, name: "Not good" },
          { from: 5, to: 7, name: "Not bad" },
          { from: 7, to: 9, name: "Pretty good" },
          { from: 9, to: 10, name: "Must play!" }
        ]
      },
      critic_score: {
        type: "range",
        ranges: [
          { from: 0, to: 50, name: "Not good" },
          { from: 50, to: 70, name: "Not bad" },
          { from: 70, to: 90, name: "Pretty good" },
          { from: 90, to: 100, name: "Must play!" }
        ]
      },
      genre: { type: "value", size: 100 },
      publisher: { type: "value", size: 100 },
      platform: { type: "value", size: 100 }
    }
  }
};

function App() {
  return (

    <SearchProvider config={configurationOptions}>
      <div>
    
      <Layout
  header={<SearchBox autocompleteSuggestions={true} />}

  bodyContent={<Results titleField="name" urlField="image_url" />}
  sideContent={
    <div>
      <Sorting
        label={"Sort by"}
        sortOptions={[
          {
            name: "Relevance",
            value: "",
            direction: ""
          },
          {
            name: "Name",
            value: "name",
            direction: "asc"
          }
        ]}
      />
      <Facet field="user_score" label="User Score" />
      <Facet field="critic_score" label="Critic Score" />
      <Facet field="genre" label="Genre" />
      <Facet field="publisher" label="Publisher" isFilterable={true} />
      <Facet field="platform" label="Platform" />
    </div>
  }
  bodyHeader={
    <>
      <PagingInfo />
      { ResultsPerPage ?
      <ResultsPerPage /> : <p>No Results</p>}
    </>
  }
  bodyFooter={<Paging />}
/>
</div>
</SearchProvider>
        
  );
}

export default App;
