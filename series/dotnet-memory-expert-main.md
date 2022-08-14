# Dotnet Memory Expert Course

This is a summary of wonderful Konrad Kokosa series `.NET Memory Expert`:

<div class="box">
  <ul class="directory-list">
    <li class="folder">dotnet runtime
      <ul>
        {% for post in site.posts %}
            {% if post.path contains 'dotnet-memory-expert\dotnet-runtime' %}
                <li>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                </li>
            {% endif %}
        {% endfor %}
      </ul>
    </li>
    <li class="folder">types basics
      <ul>
        {% for post in site.posts %}
            {% if post.path contains 'dotnet-memory-expert\types-basics' %}
                <li>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                </li>
            {% endif %}
        {% endfor %}
      </ul>
    </li>
  </ul>
</div>