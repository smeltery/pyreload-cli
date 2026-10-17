'use client';
import { useState } from 'react';
import { FileCode, Box, FolderSync, Check } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { href } from '../lib/paths';
import { recipes } from '../lib/recipes';
const icons = [FileCode, Box, FolderSync];
export function CommandRecipes({ highlighted }: { highlighted: string[] }) {
  const [selected, setSelected] = useState(0);
  const recipe = recipes[selected];
  return (
    <section className="wrap recipe-section" aria-labelledby="recipes-title">
      <div className="home-section-heading">
        <p className="eyebrow">A command for your kind of work</p>
        <h2 id="recipes-title">
          Start where <em>you are.</em>
        </h2>
        <p>
          A script on your laptop. A module in a terminal. A folder mounted into
          a container. Pick a starting point and make it yours.
        </p>
      </div>
      <div className="recipe-tabs" role="tablist" aria-label="Command examples">
        {recipes.map(({ name }, index) => (
          <button
            key={name}
            id={`recipe-tab-${index}`}
            role="tab"
            aria-selected={selected === index}
            aria-controls="recipe-panel"
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              const next =
                event.key === 'ArrowRight'
                  ? (selected + 1) % recipes.length
                  : event.key === 'ArrowLeft'
                    ? (selected + recipes.length - 1) % recipes.length
                    : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? recipes.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setSelected(next);
                document.getElementById(`recipe-tab-${next}`)?.focus();
              }
            }}
          >
            {(() => {
              const Icon = icons[index];
              return <Icon size={18} aria-hidden="true" />;
            })()}
            {name}
          </button>
        ))}
      </div>
      <div
        id="recipe-panel"
        className="recipe-panel"
        role="tabpanel"
        aria-labelledby={`recipe-tab-${selected}`}
        tabIndex={0}
      >
        <div className="recipe-explanation">
          <span className="recipe-number">0{selected + 1} / READY TO RUN</span>
          <h3>{recipe.title}</h3>
          <p>{recipe.text}</p>
          <a className="text-link" href={href(`/docs/${recipe.link}/`)}>
            {recipe.label}
          </a>
        </div>
        <div className="recipe-code">
          <div className="recipe-code-header">
            <span>{recipe.file}</span>
            <span>terminal</span>
          </div>
          <div className="recipe-command">
            <code
              className="syntax-code"
              dangerouslySetInnerHTML={{ __html: highlighted[selected] }}
            />
            <CopyButton text={recipe.command} label="Copy example command" />
          </div>
          <p>
            <Check size={15} aria-hidden="true" />
            {recipe.note}
          </p>
        </div>
      </div>
    </section>
  );
}
